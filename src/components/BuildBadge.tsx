import { For, Show, createMemo, createSignal, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { writeClipboard } from '@solid-primitives/clipboard'
import type { IconifyJSON } from '@iconify-json/logos'

import { type ShieldStyle, getShieldUrl, getSvg } from '/utils'
import SvgCheckbox from './SvgCheckbox'
import RadioGroup from './RadioGroup'

export default () => {
  const [iconKeys, setIconKeys] = createSignal<null | string[]>(null)
  const [iconData, setIconData] = createSignal<null | IconifyJSON>(null)

  const [loadDone, setLoadDone] = createSignal(false)

  onMount(() => {
    Promise.all([
      fetch('/icon_keys.json').then(res => res.json()).then(json => setIconKeys(json)),
      fetch('/icon_data.json').then(res => res.json()).then(json => setIconData(json)),
    ]).then(() => setLoadDone(true))
  })

  const svgList = createMemo(() => {
    if (loadDone()) {
      return iconKeys()!.map(name => ({ name, svg: getSvg(name, iconData()!, '2em') }))
    }
  })

  const [keyword, setKeyword] = createSignal('')
  const [step, setStep] = createSignal(1)
  const [buildList, setBuildList] = createSignal<Array<{
    name: string
    svg: string
  }>>([])
  const [shieldConfig, setShieldConfig] = createStore<{
    style: ShieldStyle
    labelColor: 'light' | 'dark'
    isSvg: boolean
    preview: boolean
    type: 'url' | 'markdown' | 'html'
  }>({
    style: 'for-the-badge',
    labelColor: 'light',
    isSvg: true,
    preview: false,
    type: 'url',
  })

  const handleNextStep = () => {
    setStep(step() + 1)
  }

  const handleBackHere = (step: number) => {
    setStep(step)
  }

  const handleCheck = (checked: boolean, name: string, svg: string) => {
    if (checked) {
      setBuildList([...buildList(), { name, svg }])
    }
    else {
      setBuildList(buildList().filter(item => item.name !== name))
    }
  }

  const filteredSvgList = createMemo(() =>
    svgList()?.filter(({ name }) => (new RegExp(keyword())).test(name)),
  )

  const shieldList = createMemo(() => {
    return step() === 3
      ? buildList().map(({ name, svg }) => ({
        name,
        url: getShieldUrl(name, svg, shieldConfig.style, shieldConfig.labelColor, shieldConfig.isSvg),
      }))
      : []
  }, [])

  const clickCopy = (value: string) => {
    writeClipboard(value)
  }

  const copyAll = () => {
    writeClipboard(shieldList().map(({ url }) => url).join('\n'))
  }

  return (
    <Show
      when={loadDone()}
      fallback={(
        <div class="w-full text-lg h-[31.5rem] text-center">
          <div class="ds-loading ds-loading-lg text-primary">
          </div>
          <div>Loading</div>
        </div>
      )}
    >
      <div class="flex flex-col gap-4">
        <div class="ds-collapse bg-base-200">
          <input
            type="radio"
            class="pointer-events-none"
            name="build-step"
            checked={step() === 1}
          />
          <div
            class="ds-collapse-title ds-alert text-xl font-medium"
            classList={{
              'ds-alert-info': step() === 1,
              'ds-alert-success': step() > 1,
            }}
          >
            <span>Step 1: Select your needed skill icon</span>
            <div class="ml-auto gap-2 flex">
              <input
                type="text"
                value={keyword()}
                onInput={e => setKeyword(e.target.value)}
                class="ds-input ds-input-sm"
                placeholder="Filter support regexp"
              />
              <Show when={step() <= 1} fallback={<button class="ds-btn ds-btn-sm" onClick={[handleBackHere, 1]}>Back here</button>}>
                <button class="ds-btn ds-btn-sm ds-btn-primary" classList={{ 'ds-btn-disabled': buildList().length === 0 }} onClick={handleNextStep}>Next</button>
              </Show>
            </div>
          </div>
          <div class="ds-collapse-content overflow-y-auto">
            <div class="h-64 pt-2 flex flex-wrap gap-1.5 transform-gpu overflow-x-hidden">
              <For each={filteredSvgList()}>
                {({ name, svg }) => (
                  <SvgCheckbox checked={buildList().some(item => item.name === name)} name={name} svg={svg} handleCheck={handleCheck} />
                )}
              </For>
            </div>
          </div>
        </div>
        <div class="ds-collapse bg-base-200">
          <input type="radio" class="pointer-events-none" name="build-step" checked={step() === 2} />
          <div
            class="ds-collapse-title ds-alert text-xl font-medium"
            classList={{
              'ds-alert-info': step() === 2,
              'ds-alert-success': step() > 2,
            }}
          >
            <span>Step 2: Custom your shield style</span>
            <div class="ml-auto flex gap-2">
              <Show when={step() <= 2} fallback={<button class="ds-btn ds-btn-sm" onClick={[handleBackHere, 2]}>Back here</button>}>
                <button class="ds-btn ds-btn-sm ds-btn-primary" classList={{ 'ds-btn-disabled': step() === 1 }} onClick={handleNextStep}>Next</button>
              </Show>
            </div>
          </div>
          <div class="ds-collapse-content">
            <div class="h-64 pt-2 flex gap-4">
              <form class="ds-form-control w-40">
                <label class="ds-label">
                  <span class="ds-label-text">Shield's style</span>
                </label>
                <RadioGroup
                  options={['for-the-badge', 'flat-square', 'plastic', 'flat', 'social']}
                  name="style"
                  mapFn={x => x.replace(/-/g, ' ')}
                  handleChange={selected => setShieldConfig({ ...shieldConfig, style: selected as ShieldStyle })}
                />
              </form>
              <form class="ds-form-control w-40">
                <label class="ds-label">
                  <span class="ds-label-text">Shield's label color</span>
                </label>
                <RadioGroup
                  options={['light', 'dark']}
                  name="labelColor"
                  handleChange={selected => setShieldConfig({ ...shieldConfig, labelColor: selected as 'light' | 'dark' })}
                />
              </form>
              <form class="ds-form-control w-40">
                <label class="ds-label">
                  <span class="ds-label-text">Shield's type</span>
                </label>
                <RadioGroup
                  options={['url', 'markdown', 'html']}
                  name="type"
                />
              </form>
              <form class="ds-form-control w-auto">
                <label class="ds-label cursor-pointer">
                  <span class="ds-label-text">Do you need a svg?</span>
                  <input type="checkbox" checked={shieldConfig.isSvg} onChange={() => setShieldConfig({ ...shieldConfig, isSvg: !shieldConfig.isSvg })} class="ds-checkbox" />
                </label>
                <label class="ds-label cursor-pointer">
                  <span class="ds-label-text">Do you need a preview?</span>
                  <input type="checkbox" checked={shieldConfig.preview} onChange={() => setShieldConfig({ ...shieldConfig, preview: !shieldConfig.preview })} class="ds-checkbox" />
                </label>
              </form>
            </div>
          </div>
        </div>
        <div class="ds-collapse bg-base-200">
          <input type="radio" class="pointer-events-none" name="build-step" checked={step() === 3} />
          <div class="ds-collapse-title ds-alert text-xl font-medium" classList={{ 'ds-alert-success': step() === 3 }}>
            <span>Step 3: Get your skill badge!</span>
            <div class="ml-auto flex gap-2">
              <span class="text-sm leading-8">Tips: Click on the badge to copy the link</span>
              <button class="ds-btn ds-btn-sm ds-btn-primary" classList={{ 'ds-btn-disabled': step() !== 3 }} onClick={copyAll}>Copy All</button>
            </div>
          </div>
          <div class="ds-collapse-content">
            <div class="h-64 pt-2 flex flex-wrap gap-1.5">
              <For each={shieldList()}>
                {({ url, name }) => {
                  return (
                    <div class="cursor-pointer inline-block" onClick={[clickCopy, url]}>
                      <Show when={shieldConfig.preview}>
                        <img src={url} alt={`${name}\'s skill badge`} />
                      </Show>
                    </div>
                  )
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

import { type ShieldStyle, getShieldUrl, getSvg } from '/utils'
import { For, Show, createSignal, splitProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import SvgCheckbox from './SvgCheckbox'
import RadioGroup from './RadioGroup'
import { writeClipboard } from '@solid-primitives/clipboard'

export default (props: { icon_keys: string[] }) => {
  const [{ icon_keys }] = splitProps(props, ['icon_keys'])

  const duplicate_keys: string[] = []
  const pure_filter_keys = /(.*)-icon$/

  icon_keys.forEach((key) => {
    const matches = key.match(pure_filter_keys)
    if (matches)
      duplicate_keys.push(matches[1])
  })

  const filtered_icon_keys = icon_keys.filter((key) => {
    return !duplicate_keys.includes(key)
  })
  const svg_list = filtered_icon_keys.map(name => ({ name, svg: getSvg(name, '2em') }))

  const [keyword, setKeyword] = createSignal('')
  const [step, setStep] = createSignal(1)
  const [buildList, setBuildList] = createSignal<Array<{
    name: string
    svg: string
  }>>([])
  const [shieldConfig, setShieldConfig] = createStore<{
    style: ShieldStyle
    labelColor: 'light' | 'dark'
  }>({
    style: 'for-the-badge',
    labelColor: 'light',
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

  const clickCopy = (value: string) => {
    writeClipboard(value)
  }

  const copyAll = () => {
    writeClipboard(
      buildList().map(v =>
        getShieldUrl(v.name, v.svg, shieldConfig.style, shieldConfig.labelColor),
      ).join('\n'),
    )
  }

  return (
    <div class="flex flex-col gap-4">
      <div class="ds-collapse bg-base-200">
        <input
          type="radio"
          class="pointer-events-none"
          name="my-accordion-2"
          checked={step() === 1}
        />
        <div class={`ds-collapse-title ds-alert text-xl font-medium ${step() > 1 ? 'ds-alert-success' : step() === 1 ? 'ds-alert-info' : ''}`}>
          <span>Step 1: Select your needed skill icon</span>
          <div class="ml-auto gap-2 flex">
            <input
              type="text"
              value={keyword()}
              onChange={e => setKeyword(e.target.value)}
              class="ds-input ds-input-sm"
              placeholder="Filter support regexp"
            />
            <Show when={step() <= 1} fallback={<button class="ds-btn ds-btn-sm" onClick={[handleBackHere, 1]}>Back here</button>}>
              <button class="ds-btn ds-btn-sm ds-btn-primary" classList={{ 'ds-btn-disabled': buildList().length === 0 }} onClick={handleNextStep}>Next</button>
            </Show>
          </div>
        </div>
        <div class="ds-collapse-content overflow-y-auto">
          <div class="h-64 p-4 flex flex-wrap gap-1.5 transform-gpu">
            {
              svg_list.filter(({ name }) => (new RegExp(keyword())).test(name))
                .map(({ name, svg }) => (
                  <SvgCheckbox name={name} svg={svg} handleCheck={handleCheck} />
                ))
            }
          </div>
        </div>
      </div>
      <div class="ds-collapse bg-base-200">
        <input type="radio" class="pointer-events-none" name="my-accordion-2" checked={step() === 2} />
        <div class={`ds-collapse-title ds-alert text-xl font-medium ${step() > 2 ? 'ds-alert-success' : step() === 2 ? 'ds-alert-info' : ''}`}>
          <span>Step 2: Custom your shield style</span>
          <div class="ml-auto flex gap-2">
            <Show when={step() <= 2} fallback={<button class="ds-btn ds-btn-sm" onClick={[handleBackHere, 2]}>Back here</button>}>
              <button class="ds-btn ds-btn-sm ds-btn-primary" classList={{ 'ds-btn-disabled': step() === 1 }} onClick={handleNextStep}>Next</button>
            </Show>
          </div>
        </div>
        <div class="ds-collapse-content">
          <div class="h-64 p-4 flex gap-4">
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
          </div>
        </div>
      </div>
      <div class="ds-collapse bg-base-200">
        <input type="radio" class="pointer-events-none" name="my-accordion-2" checked={step() === 3} />
        <div class="ds-collapse-title ds-alert text-xl font-medium" classList={{ 'ds-alert-success': step() === 3 }}>
          <span>Step 3: Get your skill badge!</span>
          <div class="ml-auto flex gap-2">
            <span class="text-sm leading-8">Tips: Click on the badge to copy the link</span>
            <button class="ds-btn ds-btn-sm ds-btn-primary" classList={{ 'ds-btn-disabled': step() !== 3 }} onClick={copyAll}>Copy All</button>
          </div>
        </div>
        <div class="ds-collapse-content">
          <div class="h-64 p-4 flex flex-wrap gap-1.5">
            <For each={buildList()}>
              {({ name, svg }) => {
                const shield_url = getShieldUrl(name, svg, shieldConfig.style, shieldConfig.labelColor)
                return (
                  <div onClick={[clickCopy, shield_url]}>
                    <img src={shield_url} alt={`${name}\'s skill badge`} title={`${name}\'s skill badge`} />
                  </div>
                )
              }}
            </For>
          </div>
        </div>
      </div>
    </div>
  )
}

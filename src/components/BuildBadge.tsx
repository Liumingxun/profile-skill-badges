import { getSvg } from '/utils'
import { Show, createSignal, splitProps } from 'solid-js'
import { createStore } from 'solid-js/store'
import SvgCheckbox from './SvgCheckbox'
import RadioGroup from './RadioGroup'

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
  const svg_list = filtered_icon_keys.slice(0, 20).map(name => ({ name, svg: getSvg(name, '2em') }))

  const [keyword, setKeyword] = createSignal('')
  const [step, setStep] = createSignal(1)
  const [buildList, setBuildList] = createSignal<string[]>([])
  const [shieldConfig, setShieldConfig] = createStore({
    style: 'for-the-badge',
    labelColor: 'light',
  })

  const handleNextStep = () => {
    setStep(step() + 1)
  }

  const handleBackHere = (step: number) => {
    setStep(step)
  }

  const handleCheck = (checked: boolean, name: string) => {
    if (checked) {
      setBuildList([...buildList(), name])
    }
    else {
      setBuildList(buildList().filter(item => item !== name))
    }
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
          <div class="h-64 p-4 flex max-w-full flex-wrap gap-1.5 transform-gpu">
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
          <div class="h-64 p-4 flex max-w-full gap-4">
            <form class="ds-form-control w-40">
              <label class="ds-label">
                <span class="ds-label-text">Shield's style</span>
              </label>
              <RadioGroup
                options={['for-the-badge', 'flat-square', 'plastic', 'flat', 'social']}
                name="style"
                mapFn={x => x.replace(/-/g, ' ')}
                handleChange={selected => setShieldConfig({ ...shieldConfig, style: selected })}
              />
            </form>
            <form class="ds-form-control w-40">
              <label class="ds-label">
                <span class="ds-label-text">Shield's label color</span>
              </label>
              <RadioGroup
                options={['light', 'dark']}
                name="labelColor"
                handleChange={selected => setShieldConfig({ ...shieldConfig, labelColor: selected })}
              />
            </form>
          </div>
        </div>
      </div>
      <div class="ds-collapse bg-base-200">
        <input type="radio" class="pointer-events-none" name="my-accordion-2" checked={step() === 3} />
        <div class="ds-collapse-title ds-alert text-xl font-medium">
          <span>Step 3: Get your badge!</span>
        </div>
        <div class="ds-collapse-content">
          <p>hello</p>
        </div>
      </div>
    </div>
  )
}

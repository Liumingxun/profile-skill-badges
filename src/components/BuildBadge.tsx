import { getSvg } from '/utils'
import SvgCheckbox from './SvgCheckbox'
import { icons } from '@iconify-json/logos'
import { Show, createSignal } from 'solid-js'

const icon_keys = Object.keys(icons.icons)
const pure_filter_keys = /(.*)-icon$/
const duplicate_keys: string[] = []

icon_keys.forEach((key) => {
  const matches = key.match(pure_filter_keys)
  if (matches)
    duplicate_keys.push(matches[1])
})

const filtered_icon_keys = icon_keys.filter((key) => {
  return !duplicate_keys.includes(key)
})

const svg_list = filtered_icon_keys.map(key => ({ name: key, svg: getSvg(key, '2em') }))

export default () => {
  const [keyword, setKeyword] = createSignal('')
  const [step, setStep] = createSignal(1)

  const handleNextStep = () => {
    setStep(step() + 1)
  }

  const handleBackHere = (step: number) => {
    setStep(step)
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
        <div class="ds-collapse-title ds-alert ds-alert-info text-xl font-medium">
          <span>Step 1: Select you needed skill icon</span>
          <div class="ml-auto gap-2 flex">
            <input
              type="text"
              value={keyword()}
              onChange={e => setKeyword(e.target.value)}
              class="ds-input ds-input-sm"
              placeholder="Filter support regexp"
            />
            <Show when={step() === 1} fallback={<button class="ds-btn ds-btn-sm" onClick={[handleBackHere, 1]}>Back here</button>}>
              <button class="ds-btn ds-btn-sm ds-btn-primary" onClick={handleNextStep}>Next</button>
            </Show>
          </div>
        </div>
        <div class="ds-collapse-content overflow-y-auto">
          <div class="h-64 p-4 flex max-w-full flex-wrap gap-2 transform-gpu">
            {
              svg_list.filter(({ name }) => (new RegExp(keyword())).test(name))
                .map(({ name, svg }) => (
                  <SvgCheckbox id={name} svg={svg} handleCheck={(checked) => { console.log(checked) }} />
                ))
            }
          </div>
        </div>
      </div>
      <div class="ds-collapse bg-base-200">
        <input type="radio" class="pointer-events-none" name="my-accordion-2" checked={step() === 2} />
        <div class="ds-collapse-title ds-alert text-xl font-medium">
          <span>Step 2: Custom your badge style</span>
          <div class="ml-auto flex gap-2">
            <Show when={step() === 2} fallback={<button class="ds-btn ds-btn-sm" onClick={[handleBackHere, 2]}>Back here</button>}>
              <button class="ds-btn ds-btn-sm ds-btn-primary" onClick={handleNextStep}>Next</button>
            </Show>
          </div>
        </div>
        <div class="ds-collapse-content">
          <p>hello</p>
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

import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { template } from 'solid-js/web'

const SvgCheckbox: Component<{ svg: string, name: string, handleCheck: (checked: boolean, name: string, svg: string) => void }> = (props) => {
  const [checked, setChecked] = createSignal(false)

  const handleCheck = () => {
    setChecked(!checked())
    props.handleCheck(checked(), props.name, props.svg)
  }

  // const fixed_name = props.name.replace(/-icon$/, '').replace(/-/g, ' ')

  return (
    <span class="ds-form-control">
      <input
        type="checkbox"
        checked={checked()}
        onChange={handleCheck}
        class="appearance-none"
        id={props.name}
      />
      <label class={`p-1 rounded-sm ${checked() ? 'ring-2' : ''}`} for={props.name}>
        {template(props.svg)()}
        {/* <span>{fixed_name}</span> */}
      </label>
    </span>
  )
}

export default SvgCheckbox

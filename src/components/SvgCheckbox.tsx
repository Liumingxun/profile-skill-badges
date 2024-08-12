import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { template } from 'solid-js/web'

const SvgCheckbox: Component<{ svg: string, handleCheck: (checked: boolean) => void, id: string }> = (props) => {
  const [checked, setChecked] = createSignal(false)

  const handleCheck = () => {
    setChecked(!checked())
    props.handleCheck(checked())
  }

  return (
    <label class={`p-1 rounded-sm ${checked() ? 'ring-2' : ''}`} id={props.id}>
      <input
        type="checkbox"
        checked={checked()}
        onChange={handleCheck}
        class="appearance-none"
      />
      {template(props.svg)()}
    </label>
  )
}

export default SvgCheckbox

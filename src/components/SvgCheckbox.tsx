import { createSignal } from 'solid-js'
import { template } from 'solid-js/web'

export default (props: {
  svg: string
  name: string
  checked: boolean
  handleCheck: (checked: boolean, name: string, svg: string) => void
}) => {
  const [checked, setChecked] = createSignal(props.checked)

  const handleCheck = () => {
    setChecked(!checked())
    props.handleCheck(checked(), props.name, props.svg)
  }

  const fixed_name = props.name.replace(/-icon$/, '').replace(/-/g, ' ')

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
        <div class="ds-tooltip ds-tooltip-bottom ds-tooltip-secondary" data-tip={fixed_name}>
          {template(props.svg)()}
        </div>
      </label>
    </span>
  )
}

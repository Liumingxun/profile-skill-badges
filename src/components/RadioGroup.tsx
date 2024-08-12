import { For, createSignal } from 'solid-js'

export default (props: {
  name: string
  options: string[]
  mapFn?: (option: string) => string
  handleChange?: (name: string) => void
}) => {
  const [selected, setSelected] = createSignal(props.options[0])

  const handleChange = (select: string) => {
    setSelected(select)
    props.handleChange?.(selected())
  }

  return (
    <form class="ds-form-control">
      <For each={props.options}>
        {option => (
          <label class="ds-label cursor-pointer">
            <input
              type="radio"
              class="ds-radio"
              name={props.name}
              value={option}
              checked={selected() === option}
              onChange={[handleChange, option]}
            />
            <span class="ds-label-text">{props.mapFn ? props.mapFn(option) : option}</span>
          </label>
        )}
      </For>
    </form>
  )
}

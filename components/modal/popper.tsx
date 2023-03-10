import { ReactNode } from "react"
import { usePopper } from "react-popper"
import { useBoolean } from "../../react/boolean"
import { useElement } from "../../react/element"
import { TargetProps } from "../../react/props"
import { Modal } from "./modal"

interface ChildrenProps {
  children: ReactNode
}

export const popperNoOffsetOptions: any = {
  placement: "bottom",
  modifiers: [{
    name: 'offset',
    options: {
      offset: [0, 5],
    },
  }]
}

export function HoverPopper(props: TargetProps & ChildrenProps) {

  const { children, target } = props

  const element = useElement<HTMLDivElement>()
  const popper = usePopper(
    target.current,
    element.current,
    popperNoOffsetOptions)
  const hovered = useBoolean()

  if (!hovered.current && !target.current)
    return null

  return <Modal>
    <div className="fixed px-2"
      style={popper.styles.popper}
      {...popper.attributes.popper}
      onMouseEnter={hovered.enable}
      onMouseLeave={hovered.disable}
      ref={element.set}>
      <div className="p-2 bg-violet2 border border-default rounded-xl animate-slidedown text-xs">
        {children}
      </div>
    </div>
  </Modal>
}
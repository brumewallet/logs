import { ButtonProps, OptionalIconProps, RefProps } from "../../../../react/props"

export function OppositeTextButton(props: ButtonProps & OptionalIconProps & RefProps<HTMLButtonElement>) {
  const { xref, icon: Icon, className, children, ...other } = props

  return <button className={`group flex items-center rounded-xl p-md border border-black border-opacity-50 bg-component text-colored transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    {...other}
    ref={xref}>
    <div className="flex  grow justify-center items-center gap-2 group-enabled:group-active:scale-90 transition-transform">
      {children}
    </div>
    {Icon && <Icon className="icon-2xl text-colored" />}
  </button>
}

export function OppositeTextButtonRounded(props: ButtonProps & RefProps<HTMLButtonElement>) {
  const { xref, className, children, ...other } = props

  return <button className={`group w-full flex items-center justify-center rounded-xl px-2 py-1 bg-black hover:bg-black text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...other}
    ref={xref}>
    <div className="flex  justify-center items-center gap-2 group-enabled:group-active:scale-90 transition-transform">
      {children}
    </div>
  </button>
}
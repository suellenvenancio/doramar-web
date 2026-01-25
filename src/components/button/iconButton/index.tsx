interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  onClick?: () => void
  className?: string
}
export function IconButton({
  className,
  icon,
  onClick,
  ...rest
}: IconButtonProps) {
  return (
    <button className={className} onClick={onClick} {...rest}>
      {icon}
    </button>
  )
}

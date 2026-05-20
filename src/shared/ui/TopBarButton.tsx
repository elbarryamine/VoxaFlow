import Link from "next/link";
import { cn } from "@/src/shared/utils/cn";

type TopBarButtonVariant = "primary" | "secondary";

const buttonVariants: Record<TopBarButtonVariant, string> = {
  primary:
    "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-manrope text-[14px] font-bold text-on-primary shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "inline-flex items-center gap-2 rounded-xl border border-border/50 bg-surface-container-lowest px-5 py-2.5 font-manrope text-[14px] font-bold text-on-surface transition-all hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50",
};

type TopBarButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TopBarButtonVariant;
};

type TopBarLinkProps = React.ComponentProps<typeof Link> & {
  variant?: TopBarButtonVariant;
};

export const TopBarButton = ({
  variant = "primary",
  className,
  ...props
}: TopBarButtonProps) => (
  <button className={cn(buttonVariants[variant], className)} {...props} />
);

export const TopBarLink = ({
  variant = "primary",
  className,
  ...props
}: TopBarLinkProps) => (
  <Link className={cn(buttonVariants[variant], className)} {...props} />
);

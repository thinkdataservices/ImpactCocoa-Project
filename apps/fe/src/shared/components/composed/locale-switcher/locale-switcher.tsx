import { Globe } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  type Locale,
  localeFlags,
  localeLabels,
  locales,
} from "@/shared/hooks/use-locale";

interface LocaleSwitcherProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LocaleSwitcher({ locale, onLocaleChange }: LocaleSwitcherProps) {
  return (
    <Popover>
      <PopoverTrigger
        className="flex size-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
        aria-label={`Language: ${localeLabels[locale]}`}
      >
        <Globe className="size-4" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={0}
        className="w-[160px] p-1"
        showArrow
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm font-light text-foreground transition-colors hover:bg-accent"
            onClick={() => onLocaleChange(l)}
          >
            <span>{localeFlags[l]}</span>
            <span>{localeLabels[l]}</span>
            {l === locale && (
              <span className="ml-auto text-foreground">✓</span>
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

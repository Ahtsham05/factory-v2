import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  IconArrowRightDashed,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { useSearch } from '@/context/search-context'
import { useTheme } from '@/context/theme-context'
import { useTranslations } from '@/hooks/use-translations'
import { useUrduFontStyle } from '@/hooks/use-urdu-font'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { getSidebarData } from './layout/data/sidebar-data'
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const { t } = useTranslations()
  const { getUrduClassName } = useUrduFontStyle()
  
  const sidebarData = getSidebarData(t)

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('command.searchPlaceholder') || 'Type a command or search...'} className={getUrduClassName()} />
      <CommandList className={getUrduClassName()}>
        <ScrollArea type='hover' className='h-72 pr-1'>
          <CommandEmpty className={getUrduClassName()}>{t('command.noResults') || 'No results found.'}</CommandEmpty>
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title} className={getUrduClassName()}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      className={getUrduClassName()}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }))
                      }}
                    >
                      <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                        <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                      </div>
                      <span className={getUrduClassName()}>{navItem.title}</span>
                    </CommandItem>
                  )

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${subItem.url}-${i}`}
                    value={subItem.title}
                    className={getUrduClassName()}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }))
                    }}
                  >
                    <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                      <IconArrowRightDashed className='text-muted-foreground/80 size-2' />
                    </div>
                    <span className={getUrduClassName()}>{subItem.title}</span>
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading={t('theme.title') || 'Theme'} className={getUrduClassName()}>
            <CommandItem className={getUrduClassName()} onSelect={() => runCommand(() => setTheme('light'))}>
              <IconSun /> <span className={getUrduClassName()}>{t('theme.light') || 'Light'}</span>
            </CommandItem>
            <CommandItem className={getUrduClassName()} onSelect={() => runCommand(() => setTheme('dark'))}>
              <IconMoon className='scale-90' />
              <span className={getUrduClassName()}>{t('theme.dark') || 'Dark'}</span>
            </CommandItem>
            <CommandItem className={getUrduClassName()} onSelect={() => runCommand(() => setTheme('system'))}>
              <IconDeviceLaptop />
              <span className={getUrduClassName()}>{t('theme.system') || 'System'}</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}

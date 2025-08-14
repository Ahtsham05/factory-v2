'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input-localized'
import { LocalizedText } from '@/components/localized-text'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/stores/store'
import { addSupplier, updateSupplier } from '@/stores/supplier.slice' // Adjusted to supplier slice
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { VoiceInputButton } from '@/components/ui/voice-input-button'

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().optional(),
  phone: z.string(),
  whatsapp: z.string().optional(),  // Added whatsapp field
  address: z.string().optional(),
})

type supplierForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  setFetch: any
}

export function SuppliersActionDialog({ currentRow, open, onOpenChange, setFetch }: Props) {
  const { t } = useTranslation()
  const isEdit = !!currentRow
  const form = useForm<supplierForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
        }
      : {
          name: '',
          email: 'party@gmail.com',
          phone: '+923',
          whatsapp: '+923',  // Added whatsapp field
          address: 'address',
        },
  })

  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = async (values: supplierForm) => {
    if (isEdit) {
      await dispatch(updateSupplier({ ...values, _id: currentRow?.id })).then(() => {
        toast.success(t('parties.partyUpdatedSuccess'))
        setFetch((prev: any) => !prev)
      })
    } else {
      await dispatch(addSupplier(values)).then(() => {
        toast.success(t('parties.partyCreatedSuccess'))
        setFetch((prev: any) => !prev)
      })
    }
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left gap-4'>
          <DialogTitle>
            <LocalizedText>
              {isEdit ? t('parties.editParty') : t('parties.addNewParty')}
            </LocalizedText>
          </DialogTitle>
          <DialogDescription>
            <LocalizedText>
              {isEdit ? t('parties.updatePartyHere') : t('parties.createNewPartyHere')}
              {t('parties.clickSaveWhenDone')}
            </LocalizedText>
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='supplier-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      <LocalizedText>
                        {t('parties.partyName')}
                      </LocalizedText>
                    </FormLabel>
                    <FormControl>
                      <div className="relative w-[288px]">
                        <Input
                          placeholder={t('parties.partyName')}
                          className='col-span-4 pr-10' /* Added pr-10 to make room for voice button */
                          autoComplete='off'
                          {...field}
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
                          <VoiceInputButton 
                            onTranscript={(text) => {
                              // Use the transcribed text as the party name
                              field.onChange(text);
                              toast.success(t('common.voiceRecognized'));
                            }}
                            size="sm"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      <LocalizedText>
                        {t('parties.email')}
                      </LocalizedText>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('parties.emailPlaceholder')}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      <LocalizedText>
                        {t('parties.phone')}
                      </LocalizedText>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('parties.phonePlaceholder')}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='whatsapp'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      <LocalizedText>
                        {t('parties.whatsapp')}
                      </LocalizedText>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('parties.whatsappPlaceholder')}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      <LocalizedText>
                        {t('parties.address')}
                      </LocalizedText>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('parties.addressPlaceholder')}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='supplier-form'>
            <LocalizedText>
              {t('common.saveChanges')}
            </LocalizedText>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

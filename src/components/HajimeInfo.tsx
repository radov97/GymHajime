'use client';

import { useState } from 'react';
import { CircleHelp } from 'lucide-react';
import ModalPopup from './ModalPopup';
import { ButtonRank, ButtonType, HajimeInfoSection } from '@/lib/enums';
import { useTranslations } from 'next-intl';
import IconButton from './IconButton';

const sections = [
  {
    id: HajimeInfoSection.Dashboard,
    paragraphs: ['paragraph-1', 'paragraph-2', 'paragraph-3'],
  },
  {
    id: HajimeInfoSection.Plan,
    paragraphs: ['paragraph-1', 'paragraph-2'],
  },
  {
    id: HajimeInfoSection.Train,
    paragraphs: ['paragraph-1', 'paragraph-2'],
  },
  {
    id: HajimeInfoSection.Progress,
    paragraphs: ['paragraph-1'],
  },
  {
    id: HajimeInfoSection.Discover,
    paragraphs: ['paragraph-1', 'paragraph-2', 'paragraph-3', 'paragraph-4'],
  },
] as const;

interface HajimeInfoProps {
  iconOnly?: boolean;
}

export default function HajimeInfo({ iconOnly = false }: HajimeInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('hajime-info');
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <IconButton
        icon={<CircleHelp className={iconOnly ? 'h-6 w-6' : 'h-4 w-4'} />}
        label={t('trigger')}
        iconOnly={iconOnly}
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className={
          iconOnly
            ? '!h-10 !w-10 !rounded-full !p-0 text-[var(--color-brand-dark)] hover:!bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
            : '!w-auto !rounded-sm !p-0 text-[var(--color-brand-dark)] underline-offset-4 hover:!bg-transparent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'
        }
      />

      <ModalPopup
        isOpen={isOpen}
        title={t('title')}
        subtitle={
          <span className="font-bold tracking-[0.18em] text-[var(--color-brand)]">
            {t('subtitle')}
          </span>
        }
        onClose={closeModal}
        closeOnBackdropClick
        buttons={[
          {
            text: t('action'),
            type: ButtonType.Button,
            rank: ButtonRank.Primary,
            onClick: closeModal,
          },
        ]}
      >
        <div className="space-y-6 text-left text-sm leading-6 text-gray-700 sm:text-base">
          <section className="space-y-3">
            <p>
              {t.rich('introduction.verb', {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </p>
            <p>{t('introduction.idea')}</p>
            <p>{t('introduction.build')}</p>
          </section>

          <div className="border-t border-orange-300" aria-hidden />

          {sections.map((section) => (
            <section key={section.id} className="space-y-2">
              <h3 className="font-black tracking-wider text-[var(--color-brand-ink)]">
                {t(`sections.${section.id}.title`)}
              </h3>
              {section.paragraphs.map((paragraphKey) => (
                <p key={paragraphKey}>{t(`sections.${section.id}.${paragraphKey}`)}</p>
              ))}
            </section>
          ))}

          <div className="border-t border-orange-300" aria-hidden />
          <p className="text-center font-bold text-[var(--color-brand-ink)]">{t('closing')}</p>
        </div>
      </ModalPopup>
    </>
  );
}

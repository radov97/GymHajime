import '../src/styles/globals.css';
import type { Preview } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import de from '../messages/de.json';
import en from '../messages/en.json';
import es from '../messages/es.json';
import fr from '../messages/fr.json';
import it from '../messages/it.json';
import ro from '../messages/ro.json';
import tl from '../messages/tl.json';

const messages = { de, en, es, fr, it, ro, tl };
type StoryLocale = keyof typeof messages;

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'de', title: 'Deutsch' },
          { value: 'es', title: 'Español' },
          { value: 'fr', title: 'Français' },
          { value: 'it', title: 'Italiano' },
          { value: 'ro', title: 'Română' },
          { value: 'tl', title: 'Tagalog' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale as StoryLocale;

      return (
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <Story />
        </NextIntlClientProvider>
      );
    },
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/en',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;

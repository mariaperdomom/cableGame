import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './config/theme';
import App from './App';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
			<MantineProvider theme={theme} defaultColorScheme='light'>
				<App />
			</MantineProvider>
	</StrictMode>
);

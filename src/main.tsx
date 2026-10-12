import { hydrateRoot, createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

const locale=window.location.pathname.startsWith('/gonella-portfolio-v1/en')?'en':'pt'
const root=document.getElementById('root')!
if(root.children.length) hydrateRoot(root,<App locale={locale}/> )
else createRoot(root).render(<App locale={locale}/> )

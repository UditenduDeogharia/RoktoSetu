import '../styles/globals.css';
import AuthGate from '../components/AuthGate';
import Phase67Hub from '../components/Phase67Hub';

export default function App({ Component, pageProps }) {
  return <AuthGate><Component {...pageProps}/><Phase67Hub/></AuthGate>;
}

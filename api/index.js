// Vercel entrypoint for the PayQuic API.
// All /api/* requests are rewritten here with the original route in ?route=.
import handler from './[...route].js';

export default handler;

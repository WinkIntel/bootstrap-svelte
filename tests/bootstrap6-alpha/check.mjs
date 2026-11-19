import { characterize } from './fixture.mjs';

console.log(JSON.stringify(await characterize(), null, 2));

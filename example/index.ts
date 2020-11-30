import { SpaceAPIOpts } from '../src/api/types';
import SpaceAPI from '../src/index';

const testUser = {
  username: 'spacejs-test',
  uuid: 'ddd876ad-ed90-474f-8f49-68a4bd4f4e45',
  passphrase: 'Test1234',
};

const testUserDev = {
  username: 'spacejs-dev-2',
  uuid: '80500b12-26ae-451f-a24a-873707344a05',
  passphrase: 'Test1234',
};

const devOpts: SpaceAPIOpts = {
  hubMultiaddress: '/ip4/54.189.77.235/tcp/4006/p2p/12D3KooWEGi5W3CaWYpX81GHBVjVPx85331Gzn34hhgtB3ARJtmQ',
  hubUrl: 'https://hub-dev-2.space.storage',
  sessionDurationInMs: 1000 * 60 * 60 * 24,
  spaceServicesAuthUrl: 'wss://auth-dev.space.storage',
  vaultSaltSecret: 'WXpKd2JrMUlUbXhhYW10M1RWUkNlV0Z0YkhCYU1tUn',
  vaultServiceUrl: 'https://vault-dev.space.storage',
};

const IS_PROD = true;
let opts = {};
let user = testUser;

if (!IS_PROD) {
  opts = devOpts;
  user = testUserDev;
}

const api = new SpaceAPI(opts);

window.onload = () => {
  console.log('Recovering keys...');
  if (!api.isLoggedIn()) {
    api
      .recoverKeysByPassphrase(user.uuid, user.passphrase)
      .then(() => {
        console.log('Logged in');
      })
      .catch(e => console.error(e));
  } else {
    console.log('User was already logged in');
  }
};

//@ts-ignore
document.getElementById('list-directory').onclick = async () => {
  console.log('listing directory...');
  api.listDirectory('', 'personal').then(res => console.log(res));
};
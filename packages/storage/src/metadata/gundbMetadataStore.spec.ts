import { Identity } from '@spacehq/users';
import { PrivateKey } from '@textile/crypto';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiSubset from 'chai-subset';
import { expect, use } from 'chai';
import { GundbMetadataStore } from './gundbMetadataStore';

use(chaiAsPromised.default);
use(chaiSubset.default);

const identity: Identity = PrivateKey.fromRandom();
const username = Buffer.from(identity.public.pubKey).toString('hex');
const password = Buffer.from(identity.privKey).toString('hex');
describe('GunsdbMetadataStore', () => {
  it('should work', async () => {
    const bucket = 'personal';
    const dbId = 'something';
    const store = await GundbMetadataStore.fromIdentity(username, password);

    // test create bucket data
    const newSchema = await store.createBucket(bucket, dbId);
    expect(newSchema).to.containSubset({ dbId, slug: bucket });

    // eslint-disable-next-line no-unused-expressions
    expect(newSchema.encryptionKey).to.not.be.empty;

    // test find bucket data
    const foundSchema = await store.findBucket(bucket);
    expect(foundSchema).to.containSubset({ dbId, slug: bucket });
    expect(Buffer.from(foundSchema?.encryptionKey || '').toString('hex')).to
      .equal(Buffer.from(newSchema.encryptionKey).toString('hex'));

    // ensure list bucket returns all value on fresh initialization
    const newStore = await GundbMetadataStore.fromIdentity(username, password);

    const existingBuckets = await newStore.listBuckets();
    expect(existingBuckets).to.containSubset([{ dbId, slug: bucket }]);
  }).timeout(10000);

  it('should work for file metadata', async () => {
    const bucketSlug = 'personal';
    const dbId = 'something';
    const path = '/home/case.png';
    const store = await GundbMetadataStore.fromIdentity(username, password);

    await store.upsertFileMetadata({ mimeType: 'image/png', bucketSlug, dbId, path });

    const fileMetadata = await store.findFileMetadata(bucketSlug, dbId, path);
    expect(fileMetadata).to.deep.equal({
      bucketSlug,
      dbId,
      path,
      mimeType: 'image/png',
    });
  }).timeout(10000);
});

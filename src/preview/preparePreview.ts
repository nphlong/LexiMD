import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';

import { PREVIEW_BUNDLE_VERSION } from './generated/previewVersion';
import mermaidAsset from '../../assets/preview/mermaid.min.mermaidjs';
import { previewShell, PreviewMessages } from './previewShell';

export type PreviewFiles = {
  htmlUri: string;
  readAccessUri: string;
};

function withSlash(uri: string): string {
  return uri.endsWith('/') ? uri : `${uri}/`;
}

export async function preparePreviewFiles(messages: PreviewMessages): Promise<PreviewFiles> {
  const directory = new Directory(Paths.document, 'preview');
  if (!directory.exists) {
    directory.create();
  }

  const mermaidFile = new File(directory, 'mermaid.min.js');
  const versionFile = new File(directory, 'version.txt');
  const installed = versionFile.exists ? await versionFile.text() : '';
  if (!mermaidFile.exists || installed !== PREVIEW_BUNDLE_VERSION) {
    const asset = Asset.fromModule(mermaidAsset);
    await asset.downloadAsync();
    if (!asset.localUri) {
      throw new Error('Preview library is not on this phone.');
    }
    if (mermaidFile.exists) {
      mermaidFile.delete();
    }
    await new File(asset.localUri).copy(mermaidFile);
    await versionFile.write(PREVIEW_BUNDLE_VERSION);
  }

  const htmlFile = new File(directory, 'index.html');
  await htmlFile.write(previewShell(messages));
  return { htmlUri: htmlFile.uri, readAccessUri: withSlash(directory.uri) };
}

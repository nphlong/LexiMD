import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

import { copy } from '../copy';
import { preparePreviewFiles, PreviewFiles } from './preparePreview';
import { renderMarkdown } from './renderMarkdown';
import { PREVIEW_UPDATE_MS } from './timing';

// The library defaults its props generic to `undefined`, and `WebViewProps & undefined` is `never`.
type WebViewExtras = Record<never, never>;

type Props = {
  markdown: string;
};

function allows(url: string): boolean {
  return url.startsWith('file:') || url.startsWith('about:');
}

export function PreviewPane({ markdown }: Props) {
  const webRef = useRef<WebView>(null);
  const markdownRef = useRef(markdown);
  const [page, setPage] = useState<PreviewFiles | null>(null);
  const [failed, setFailed] = useState(false);

  const push = useCallback(() => {
    const html = renderMarkdown(markdownRef.current);
    webRef.current?.injectJavaScript(`window.renderHtml(${JSON.stringify(html)}); true;`);
  }, []);

  useEffect(() => {
    let cancelled = false;
    preparePreviewFiles({
      diagramError: copy.diagramError,
      previewFailed: copy.previewFailed,
    })
      .then((files) => {
        if (!cancelled) {
          setPage(files);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    markdownRef.current = markdown;
    const timer = setTimeout(push, PREVIEW_UPDATE_MS);
    return () => clearTimeout(timer);
  }, [markdown, push]);

  function onShouldStart(request: WebViewNavigation) {
    return allows(request.url);
  }

  if (failed) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>{copy.previewFailed}</Text>
      </View>
    );
  }

  if (!page) {
    return <View style={styles.fallback} />;
  }

  return (
    <WebView<WebViewExtras>
      ref={webRef}
      allowFileAccess
      allowFileAccessFromFileURLs
      allowingReadAccessToURL={page.readAccessUri}
      cacheEnabled={false}
      cacheMode="LOAD_NO_CACHE"
      onLoadEnd={push}
      onShouldStartLoadWithRequest={onShouldStart}
      originWhitelist={['*']}
      setSupportMultipleWindows={false}
      source={{ uri: page.htmlUri }}
      style={styles.web}
    />
  );
}

const styles = StyleSheet.create({
  web: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fallback: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 16,
  },
  fallbackText: {
    color: '#8a1f1f',
    fontSize: 16,
    lineHeight: 22,
  },
});

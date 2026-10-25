import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

import { Scheme } from '../settings/settings';
import { preparePreviewFiles, PreviewFiles } from './preparePreview';
import { renderMarkdown } from './renderMarkdown';
import { PREVIEW_UPDATE_MS } from './timing';

// The library defaults its props generic to `undefined`, and `WebViewProps & undefined` is `never`.
type WebViewExtras = Record<never, never>;

type Props = {
  markdown: string;
  theme: Scheme;
  diagramError: string;
  previewFailed: string;
  backgroundColor: string;
  textColor: string;
};

function allows(url: string): boolean {
  return url.startsWith('file:') || url.startsWith('about:');
}

export function PreviewPane({
  markdown,
  theme,
  diagramError,
  previewFailed,
  backgroundColor,
  textColor,
}: Props) {
  const webRef = useRef<WebView>(null);
  const markdownRef = useRef(markdown);
  const themeRef = useRef(theme);
  const diagramErrorRef = useRef(diagramError);
  const previewFailedRef = useRef(previewFailed);
  const [page, setPage] = useState<PreviewFiles | null>(null);
  const [failed, setFailed] = useState(false);

  const push = useCallback(() => {
    const html = renderMarkdown(markdownRef.current);
    const options = JSON.stringify({
      diagramError: diagramErrorRef.current,
      previewFailed: previewFailedRef.current,
      theme: themeRef.current,
    });
    webRef.current?.injectJavaScript(`window.renderHtml(${JSON.stringify(html)}, ${options}); true;`);
  }, []);

  useEffect(() => {
    markdownRef.current = markdown;
    themeRef.current = theme;
    diagramErrorRef.current = diagramError;
    previewFailedRef.current = previewFailed;
    const timer = setTimeout(push, PREVIEW_UPDATE_MS);
    return () => clearTimeout(timer);
  }, [diagramError, markdown, previewFailed, push, theme]);

  useEffect(() => {
    let cancelled = false;
    preparePreviewFiles(
      {
        diagramError: diagramErrorRef.current,
        previewFailed: previewFailedRef.current,
      },
      themeRef.current,
    )
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

  function onShouldStart(request: WebViewNavigation) {
    return allows(request.url);
  }

  if (failed) {
    return (
      <View style={[styles.fallback, { backgroundColor }]}>
        <Text style={[styles.fallbackText, { color: textColor }]}>{previewFailed}</Text>
      </View>
    );
  }

  if (!page) {
    return <View style={[styles.fallback, { backgroundColor }]} />;
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
      style={[styles.web, { backgroundColor }]}
    />
  );
}

const styles = StyleSheet.create({
  web: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  fallbackText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

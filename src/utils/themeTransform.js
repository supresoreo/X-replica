import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

const DARK_BG_VALUES = new Set(['#000', '#000000', '#0f1419', '#111111', '#1e2124', '#0f1420', '#0b0f16']);
const LIGHT_BG_VALUES = new Set(['#fff', '#ffffff', '#f7f9fb', '#eff3f4']);
const DARK_BORDER_VALUES = new Set(['#16181c', '#1f2428', '#2f3336', '#0f1420']);
const LIGHT_BORDER_VALUES = new Set(['#e6ecf0', '#eff3f4', '#d8e0e5', '#cfd9de']);
const LIGHT_TEXT_VALUES = new Set(['#fff', '#ffffff', '#f2f2f2', '#e7e9ea', '#f3f5f6', '#dfdfdf']);
const DARK_TEXT_VALUES = new Set(['#000', '#000000', '#0f1419', '#111111']);
const DARK_MUTED_TEXT_VALUES = new Set(['#8b98a5', '#71767b', '#6f7a83', '#6e7680', '#767f87', '#818994', '#a3a9b0', '#74808a']);
const LIGHT_MUTED_TEXT_VALUES = new Set(['#536471', '#657786', '#5b7083', '#71767b']);

const normalizeColorValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().toLowerCase();
};

const adaptColorByKey = (styleKey, styleValue, isDark) => {
  if (typeof styleValue !== 'string' || !styleValue.startsWith('#')) {
    return styleValue;
  }

  const normalized = normalizeColorValue(styleValue);
  const normalizedKey = (styleKey || '').toLowerCase();
  const isBackgroundKey = normalizedKey.includes('backgroundcolor');
  const isBorderKey = normalizedKey.includes('border') && normalizedKey.includes('color');
  const isTextColorKey = normalizedKey === 'color' || normalizedKey.includes('textcolor') || normalizedKey.includes('placeholdertextcolor');
  const isVectorColorKey = normalizedKey === 'fill' || normalizedKey === 'stroke' || normalizedKey.includes('tintcolor');

  if (isBackgroundKey) {
    if (isDark && LIGHT_BG_VALUES.has(normalized)) {
      return '#000000';
    }
    if (!isDark && DARK_BG_VALUES.has(normalized)) {
      return '#ffffff';
    }
    return styleValue;
  }

  if (isBorderKey) {
    if (isDark && LIGHT_BORDER_VALUES.has(normalized)) {
      return '#2f3336';
    }
    if (!isDark && DARK_BORDER_VALUES.has(normalized)) {
      return '#d8e0e5';
    }
    return styleValue;
  }

  if (isTextColorKey || isVectorColorKey) {
    if (isDark && DARK_TEXT_VALUES.has(normalized)) {
      return '#f2f2f2';
    }
    if (!isDark && LIGHT_TEXT_VALUES.has(normalized)) {
      return '#0f1419';
    }
    if (isDark && LIGHT_MUTED_TEXT_VALUES.has(normalized)) {
      return '#8b98a5';
    }
    if (!isDark && DARK_MUTED_TEXT_VALUES.has(normalized)) {
      return '#536471';
    }
  }

  return styleValue;
};

const transformStyleObject = (style, isDark, textScale) => {
  if (!style) {
    return style;
  }

  if (Array.isArray(style)) {
    return style.map((entry) => transformStyleObject(entry, isDark, textScale));
  }

  if (typeof style === 'number') {
    return transformStyleObject(StyleSheet.flatten(style), isDark, textScale);
  }

  if (typeof style !== 'object') {
    return style;
  }

  const next = { ...style };

  Object.keys(next).forEach((key) => {
    next[key] = adaptColorByKey(key, next[key], isDark);
  });

  if (typeof next.fontSize === 'number') {
    next.fontSize = next.fontSize * textScale;
  }

  if (typeof next.lineHeight === 'number') {
    next.lineHeight = next.lineHeight * textScale;
  }

  return next;
};

export const transformNodeForDisplay = (node, isDark, textScale, iconScale) => {
  if (!React.isValidElement(node)) {
    return node;
  }

  const nextProps = {};
  const originalStyle = node.props?.style;

  if (originalStyle) {
    nextProps.style = transformStyleObject(originalStyle, isDark, textScale);
  }

  if (typeof node.props?.size === 'number') {
    nextProps.size = node.props.size * iconScale;
  }

  if (typeof node.props?.color === 'string') {
    nextProps.color = adaptColorByKey('color', node.props.color, isDark);
  }

  if (typeof node.props?.fill === 'string') {
    nextProps.fill = adaptColorByKey('fill', node.props.fill, isDark);
  }

  if (typeof node.props?.stroke === 'string') {
    nextProps.stroke = adaptColorByKey('stroke', node.props.stroke, isDark);
  }

  if (typeof node.props?.placeholderTextColor === 'string') {
    nextProps.placeholderTextColor = adaptColorByKey('placeholderTextColor', node.props.placeholderTextColor, isDark);
  }

  if (node.type === Text || node.type === TextInput) {
    const baseTextStyle = originalStyle ? transformStyleObject(originalStyle, isDark, textScale) : {};
    nextProps.style = [baseTextStyle, !originalStyle ? { fontSize: 16 * textScale } : null];
  }

  if (node.props?.children) {
    nextProps.children = React.Children.map(node.props.children, (child) =>
      transformNodeForDisplay(child, isDark, textScale, iconScale)
    );
  }

  return React.cloneElement(node, nextProps);
};

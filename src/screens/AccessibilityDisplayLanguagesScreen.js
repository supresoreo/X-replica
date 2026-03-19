import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import {
  Accessibility,
  ArrowLeft,
  ChartBar,
  ChevronRight,
  Languages,
  Moon,
  Palette,
  Sun,
  SunMoon,
} from 'lucide-react-native/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/appStore';
import { transformNodeForDisplay } from '../utils/themeTransform';

const useDisplaySync = () => {
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const systemScheme = useColorScheme();
  const isDark = displayMode === 'night' || (displayMode === 'system' && systemScheme === 'dark');
  const textScale = [0.92, 1, 1.08, 1.16][fontScaleLevel] || 1;
  const iconScale = [0.9, 1, 1.1, 1.2][fontScaleLevel] || 1;

  return {
    isDark,
    textScale,
    iconScale,
    switchTrackFalse: isDark ? '#262a34' : '#cfd9de',
    switchThumb: isDark ? '#f5f7fa' : '#ffffff',
  };
};

const SECTION_ITEMS = [
  {
    key: 'accessibility',
    title: 'Accessibility',
    description:
      'Manage aspects of your X experience such as limiting color contrast and motion. These settings affect all the X accounts on this device.',
    icon: Accessibility,
  },
  {
    key: 'display',
    title: 'Display',
    description:
      'Manage your font size, color and background. These settings affect all the X accounts on this device.',
    icon: Palette,
  },
  {
    key: 'languages',
    title: 'Languages',
    description: 'Manage which languages are used to personalize your X experience.',
    icon: Languages,
  },
  {
    key: 'data-usage',
    title: 'Data usage',
    description:
      'Limit how X uses some of your network data. These settings affect all the X accounts on this device.',
    icon: ChartBar,
  },
];

export const AccessibilityDisplayLanguagesScreen = ({
  onBack,
  onOpenAccessibility,
  onOpenDisplay,
  onOpenLanguages,
  onOpenDataUsage,
}) => {
  const insets = useSafeAreaInsets();
  const currentUser = useAppStore((state) => state.currentUser);
  const { isDark, textScale, iconScale } = useDisplaySync();

  const onPressMap = {
    accessibility: onOpenAccessibility,
    display: onOpenDisplay,
    languages: onOpenLanguages,
    'data-usage': onOpenDataUsage,
  };

  const contentNode = (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}> 
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={onBack}>
          <ArrowLeft size={27} color="#f2f2f2" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Accessibility, display, and languages</Text>
          <Text style={styles.username}>{currentUser?.username || '@user'}</Text>
        </View>
        <View style={styles.rightSpacer} />
      </View>

      <Text style={styles.description}>Manage how X content is displayed to you.</Text>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {SECTION_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasValidIcon = typeof Icon === 'function';
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.82}
              style={styles.itemRow}
              onPress={onPressMap[item.key]}
            >
              {hasValidIcon ? (
                <Icon size={24} color="#8d949b" strokeWidth={2} />
              ) : (
                <View style={styles.iconFallback} />
              )}
              <View style={styles.itemTextWrap}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <ChevronRight size={22} color="#444c55" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

const SettingsHeader = ({ title, username, onBack }) => {
  return (
    <View style={styles.header}> 
      <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={onBack}>
        <ArrowLeft size={27} color="#f2f2f2" />
      </TouchableOpacity>
      <View style={styles.headerTextWrap}>
        <Text style={styles.title}>{title}</Text>
        {username ? <Text style={styles.username}>{username}</Text> : null}
      </View>
      <View style={styles.rightSpacer} />
    </View>
  );
};

const SettingRow = ({ label, description, value, onPress, showChevron = true, children }) => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.settingRow} onPress={onPress}>
      <View style={styles.settingTextWrap}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
      </View>
      {children ? children : null}
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {showChevron ? <ChevronRight size={20} color="#4f565f" /> : null}
    </TouchableOpacity>
  );
};

export const AccessibilitySettingsScreen = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { isDark, textScale, iconScale, switchTrackFalse, switchThumb } = useDisplaySync();
  const [pronounceHashtag, setPronounceHashtag] = useState(false);
  const [includeUsernames, setIncludeUsernames] = useState(false);
  const [readUrls, setReadUrls] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [imageReminder, setImageReminder] = useState(false);

  const contentNode = (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top + 6 }}>
        <SettingsHeader title="Accessibility" username="" onBack={onBack} />
      </View>

      <Text style={styles.descriptionBlock}>
        Manage aspects of your X experience such as limiting color contrast and motion. These settings affect all the X accounts on this device.
      </Text>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInnerLeaf}>
        <Text style={styles.sectionHeading}>VoiceOver</Text>

        <SettingRow label='Pronounce # as "hashtag"' showChevron={false}>
          <Switch
            value={pronounceHashtag}
            onValueChange={setPronounceHashtag}
            trackColor={{ false: switchTrackFalse, true: '#1d9bf0' }}
            thumbColor={switchThumb}
          />
        </SettingRow>

        <SettingRow label="Include usernames in timelines" showChevron={false}>
          <Switch
            value={includeUsernames}
            onValueChange={setIncludeUsernames}
            trackColor={{ false: switchTrackFalse, true: '#1d9bf0' }}
            thumbColor={switchThumb}
          />
        </SettingRow>

        <SettingRow label="Read shortened URLs" showChevron={false}>
          <Switch
            value={readUrls}
            onValueChange={setReadUrls}
            trackColor={{ false: switchTrackFalse, true: '#1d9bf0' }}
            thumbColor={switchThumb}
          />
        </SettingRow>

        <Text style={styles.sectionHeading}>Interaction</Text>
        <SettingRow label="Magic Tap action" value="None" />

        <Text style={styles.sectionHeading}>Motion</Text>
        <SettingRow
          label="Reduce motion"
          description="Limits the amount of in-app animations, including screen transitions and live engagement counts."
          showChevron={false}
        >
          <Switch
            value={reduceMotion}
            onValueChange={setReduceMotion}
            trackColor={{ false: switchTrackFalse, true: '#1d9bf0' }}
            thumbColor={switchThumb}
          />
        </SettingRow>
        <SettingRow label="Video autoplay" value="On cellular or Wi-Fi" />

        <Text style={styles.sectionHeading}>Media</Text>
        <SettingRow
          label="Receive image description reminder"
          description="Enables a reminder to add image descriptions before a post can be sent."
          showChevron={false}
        >
          <Switch
            value={imageReminder}
            onValueChange={setImageReminder}
            trackColor={{ false: switchTrackFalse, true: '#1d9bf0' }}
            thumbColor={switchThumb}
          />
        </SettingRow>

        <Text style={styles.sectionHeading}>Sound</Text>
      </ScrollView>
    </View>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

export const DisplaySettingsScreen = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { isDark, textScale, iconScale } = useDisplaySync();
  const displayMode = useAppStore((state) => state.displayMode);
  const fontScaleLevel = useAppStore((state) => state.fontScaleLevel);
  const setDisplayMode = useAppStore((state) => state.setDisplayMode);
  const setFontScaleLevel = useAppStore((state) => state.setFontScaleLevel);
  const fontPreviewLevels = ['Aa', 'Aa', 'Aa', 'Aa'];
  const sliderThumbStyle = { left: `${fontScaleLevel * 30}%` };

  const contentNode = (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top + 6 }}>
        <SettingsHeader title="Display" username="" onBack={onBack} />
      </View>

      <Text style={styles.descriptionBlock}>
        Manage your font size, color and background. These settings affect all the X accounts on this device.
      </Text>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInnerLeaf}>
        <View style={styles.themeCardsWrap}>
          {[
            { id: 'system', label: 'System', Icon: SunMoon },
            { id: 'day', label: 'Day', Icon: Sun },
            { id: 'night', label: 'Night', Icon: Moon },
          ].map((option) => (
            <TouchableOpacity
              key={option.id}
              activeOpacity={0.85}
              style={[styles.themeCard, displayMode === option.id && styles.themeCardActive]}
              onPress={() => setDisplayMode(option.id)}
            >
              <option.Icon
                size={27}
                color={displayMode === option.id ? '#f2f2f2' : '#8a929a'}
                strokeWidth={2}
                style={styles.themeIcon}
              />
              <Text style={[styles.themeLabel, displayMode === option.id && styles.themeLabelActive]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionHeading}>Font size</Text>

        <View style={styles.tweetPreviewCard}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewBrand}>X</Text>
            <View style={styles.previewUserWrap}>
              <Text style={styles.previewName}>X</Text>
              <Text style={styles.previewMeta}>@X · 10m</Text>
            </View>
            <Text style={styles.previewClose}>X</Text>
          </View>
          <Text style={styles.previewContent}>
            At the heart of X are short messages called posts just like this one which can include photos, videos, links, text, hashtags, and mentions like @X.
          </Text>
          <View style={styles.previewActions}>
            <Text style={styles.previewAction}>o</Text>
            <Text style={styles.previewAction}>o</Text>
            <Text style={styles.previewAction}>o</Text>
            <Text style={styles.previewAction}>o</Text>
            <Text style={styles.previewAction}>o</Text>
          </View>
        </View>

        <View style={styles.sliderWrap}>
          <Text style={styles.sliderText}>{fontPreviewLevels[0]}</Text>
          <View style={styles.sliderTrack}>
            {[0, 1, 2, 3].map((level) => (
              <TouchableOpacity
                key={`font-level-${level}`}
                activeOpacity={0.85}
                style={styles.sliderStepTouch}
                onPress={() => setFontScaleLevel(level)}
              >
                <View style={[styles.sliderDot, fontScaleLevel === level && styles.sliderDotActive]} />
              </TouchableOpacity>
            ))}
            <View style={[styles.sliderThumb, sliderThumbStyle]} />
          </View>
          <Text style={styles.sliderTextLarge}>{fontPreviewLevels[3]}</Text>
        </View>
      </ScrollView>
    </View>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

export const LanguagesSettingsScreen = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const currentUser = useAppStore((state) => state.currentUser);
  const { isDark, textScale, iconScale } = useDisplaySync();

  const contentNode = (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top + 6 }}>
        <SettingsHeader title="Languages" username={currentUser?.username || '@user'} onBack={onBack} />
      </View>

      <Text style={styles.descriptionBlock}>
        Manage which languages are used to personalize your X experience.
      </Text>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInnerLeaf}>
        <SettingRow
          label="Content languages"
          description="Select which languages you want recommended posts, people, and trends to include."
        />
      </ScrollView>
    </View>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

export const DataUsageSettingsScreen = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { isDark, textScale, iconScale, switchTrackFalse, switchThumb } = useDisplaySync();
  const [dataSaver, setDataSaver] = useState(false);

  const contentNode = (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top + 6 }}>
        <SettingsHeader title="Data usage" username="" onBack={onBack} />
      </View>

      <Text style={styles.descriptionBlock}>
        Limit how X uses some of your network data. These settings affect all the X accounts on this device.
      </Text>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInnerLeaf}>
        <SettingRow
          label="Data saver"
          description="When enabled, videos will not autoplay and lower-quality images load. This automatically reduces your data usage for all X accounts on this device."
          showChevron={false}
        >
          <Switch
            value={dataSaver}
            onValueChange={setDataSaver}
            trackColor={{ false: switchTrackFalse, true: '#1d9bf0' }}
            thumbColor={switchThumb}
          />
        </SettingRow>

        <SettingRow
          label="High-quality images"
          value="On cellular or Wi-Fi"
          description="Select when high-quality images should load."
        />
        <SettingRow
          label="High-quality image uploads"
          value="Never"
          description="Select when to upload high-quality images (up to 4K)."
        />
        <SettingRow
          label="High-quality video"
          value="On cellular or Wi-Fi"
          description="Select when the highest quality available should play."
        />
        <SettingRow
          label="Video autoplay"
          value="On cellular or Wi-Fi"
          description="Select when videos should play automatically."
        />

        <Text style={styles.sectionHeading}>Storage</Text>
        <SettingRow label="Media storage" value="73.2 MB" />
        <SettingRow label="Web storage" value="41.2 MB" />
      </ScrollView>
    </View>
  );

  return transformNodeForDisplay(contentNode, isDark, textScale, iconScale);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#f2f2f2',
    fontSize: 40 / 2,
    fontWeight: '800',
    textAlign: 'center',
  },
  username: {
    color: '#6f7a83',
    fontSize: 16,
    marginTop: 2,
  },
  rightSpacer: {
    width: 36,
  },
  description: {
    color: '#6e7680',
    fontSize: 33 / 2,
    lineHeight: 22,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 14,
    paddingBottom: 110,
  },
  contentInnerLeaf: {
    paddingBottom: 110,
  },
  descriptionBlock: {
    color: '#6e7680',
    fontSize: 33 / 2,
    lineHeight: 25,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  iconFallback: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5a636d',
  },
  itemTextWrap: {
    flex: 1,
  },
  itemTitle: {
    color: '#f2f2f2',
    fontSize: 37 / 2,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemDescription: {
    color: '#6e7680',
    fontSize: 33 / 2,
    lineHeight: 22,
  },
  sectionHeading: {
    color: '#f1f3f5',
    fontSize: 22,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#1f2428',
  },
  settingRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2428',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingLabel: {
    color: '#f2f2f2',
    fontSize: 36 / 2,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDescription: {
    color: '#6e7680',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
    paddingRight: 8,
  },
  rowValue: {
    color: '#818994',
    fontSize: 17,
    marginRight: 2,
  },
  themeCardsWrap: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  themeCard: {
    flex: 1,
    height: 126,
    borderWidth: 1,
    borderColor: '#1f2428',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  themeCardActive: {
    backgroundColor: '#0f1420',
    borderColor: '#0f1420',
  },
  themeGlyph: {
    color: '#f2f2f2',
    fontSize: 34,
    marginBottom: 8,
  },
  themeIcon: {
    marginBottom: 8,
  },
  themeLabel: {
    color: '#8a929a',
    fontSize: 18,
  },
  themeLabelActive: {
    color: '#f2f2f2',
  },
  tweetPreviewCard: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1f2428',
    marginTop: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewBrand: {
    color: '#f2f2f2',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 10,
  },
  previewUserWrap: {
    flex: 1,
  },
  previewName: {
    color: '#f2f2f2',
    fontSize: 17,
    fontWeight: '700',
  },
  previewMeta: {
    color: '#8b929a',
    fontSize: 16,
  },
  previewClose: {
    color: '#a3a9b0',
    fontSize: 18,
    fontWeight: '700',
  },
  previewContent: {
    color: '#d8dde2',
    fontSize: 18,
    lineHeight: 30,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  previewAction: {
    color: '#74808a',
    fontSize: 22,
  },
  sliderWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sliderText: {
    color: '#d7dbe0',
    fontSize: 30 / 2,
    marginRight: 10,
  },
  sliderTextLarge: {
    color: '#d7dbe0',
    fontSize: 24,
    marginLeft: 10,
  },
  sliderTrack: {
    flex: 1,
    height: 3,
    backgroundColor: '#55606a',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  sliderStepTouch: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -2,
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#79828c',
  },
  sliderDotActive: {
    backgroundColor: '#f4f6f8',
  },
  sliderThumb: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f4f6f8',
    top: -20,
    marginLeft: -22,
  },
  leafSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#1f2428',
    paddingVertical: 16,
  },
  leafTitle: {
    color: '#f2f2f2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  leafBody: {
    color: '#6e7680',
    fontSize: 15,
    lineHeight: 22,
  },
});
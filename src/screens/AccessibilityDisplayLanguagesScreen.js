import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { styles } from '../styles/screens/AccessibilityDisplayLanguagesScreen.styles';
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

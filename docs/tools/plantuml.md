# PlantUML - 用代码绘图

## 自定义主题

```plantuml
!$THEME_WHITE_COLOR = "FFFFFF"
!$THEME_FONT_COLOR = "2B2B2B"
!$THEME_BORDER_COLOR = "29699B"
!$THEME_BACKGROUND_COLOR = "D4E0F0"

skinparam BackgroundColor $THEME_WHITE_COLOR
skinparam shadowing false
skinparam RoundCorner 5
skinparam ArrowColor $THEME_BORDER_COLOR
skinparam FontColor $THEME_FONT_COLOR
skinparam SequenceLifeLineBorderColor $THEME_BORDER_COLOR
skinparam SequenceLifeLineBackgroundColor $THEME_BACKGROUND_COLOR

skinparam sequenceGroupBackgroundColor $THEME_BACKGROUND_COLOR
skinparam SequenceGroupHeaderFontColor $THEME_FONT_COLOR
skinparam SequenceGroupBodyBackgroundColor $THEME_WHITE_COLOR
skinparam SequenceGroupFontColor $THEME_FONT_COLOR
skinparam SequenceGroupBorderColor $THEME_BORDER_COLOR
skinparam SequenceGroupBorderThickness 1

skinparam participant {
    BackgroundColor $THEME_BACKGROUND_COLOR
    BorderColor $THEME_BORDER_COLOR
    FontColor $THEME_FONT_COLOR
    BorderThickness 2
}
```

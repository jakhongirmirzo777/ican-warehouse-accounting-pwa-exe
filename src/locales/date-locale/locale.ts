import { useI18n } from 'vue-i18n'

export default () => {
  const { t } = useI18n()
  const el = {
    name: 'af',
    el: {
      datepicker: {
        year: '',
        month1: t('$dates.monthsFirstUpper.0'),
        month2: t('$dates.monthsFirstUpper.1'),
        month3: t('$dates.monthsFirstUpper.2'),
        month4: t('$dates.monthsFirstUpper.3'),
        month5: t('$dates.monthsFirstUpper.4'),
        month6: t('$dates.monthsFirstUpper.5'),
        month7: t('$dates.monthsFirstUpper.6'),
        month8: t('$dates.monthsFirstUpper.7'),
        month9: t('$dates.monthsFirstUpper.8'),
        month10: t('$dates.monthsFirstUpper.9'),
        month11: t('$dates.monthsFirstUpper.10'),
        month12: t('$dates.monthsFirstUpper.11'),
        weeks: {
          sun: t('$dates.weeks.0'),
          mon: t('$dates.weeks.1'),
          tue: t('$dates.weeks.2'),
          wed: t('$dates.weeks.3'),
          thu: t('$dates.weeks.4'),
          fri: t('$dates.weeks.5'),
          sat: t('$dates.weeks.6'),
        },
        months: {
          jan: t('$dates.monthsFirstUpper.0'),
          feb: t('$dates.monthsFirstUpper.1'),
          mar: t('$dates.monthsFirstUpper.2'),
          apr: t('$dates.monthsFirstUpper.3'),
          may: t('$dates.monthsFirstUpper.4'),
          jun: t('$dates.monthsFirstUpper.5'),
          jul: t('$dates.monthsFirstUpper.6'),
          aug: t('$dates.monthsFirstUpper.7'),
          sep: t('$dates.monthsFirstUpper.8'),
          oct: t('$dates.monthsFirstUpper.9'),
          nov: t('$dates.monthsFirstUpper.10'),
          dec: t('$dates.monthsFirstUpper.11'),
        },
      },
    },
  }
  return { el }
}

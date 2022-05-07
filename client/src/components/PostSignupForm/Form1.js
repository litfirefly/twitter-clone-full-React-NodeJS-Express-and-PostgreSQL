import PropTypes from 'prop-types';

import SelectInput from '../SelectInput';
import Button from '../Button';

const DateOptions = {
  months: [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ],
  year_range: 120,
  daysInMonth(month, year) {
    if (!month || !year) return [];
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({ value: String(i), label: String(i) });
    }
    return days;
  },
  getYearsInRange(yearRange) {
    const years = [];
    const currentYear = new Date().getFullYear();
    // eslint-disable-next-line no-plusplus
    for (let i = currentYear; i >= currentYear - yearRange; i--) {
      years.push({ value: String(i), label: String(i) });
    }
    return years;
  },
};

const Form1 = ({ formData, isLoading }) => {
  return (
    <form className="h-full relative" onSubmit={formData.handleSubmit}>
      <div className="mb-6">
        <h1 className="text-on-surface text-3xl font-bold mb-1">
          What&apos;s your birth date?
        </h1>
        <h4 className="text-on-surface text-sm">
          Don&apos;t worry, this won&apos;t be public
        </h4>
      </div>
      <div className="flex justify-between gap-3 mb-4">
        <div className="w-1/2">
          <SelectInput
            id="month"
            name="month"
            value={formData.values.month}
            label="Month"
            onFocus={formData.handleFocus}
            onBlur={formData.handleBlur}
            onChange={formData.handleChange}
            error={formData.touched.month ? formData.errors.month : ''}
            options={DateOptions.months}
          />
        </div>
        <div className="w-1/4">
          <SelectInput
            id="year"
            name="year"
            value={formData.values.year}
            label="Year"
            onFocus={formData.handleFocus}
            onBlur={formData.handleBlur}
            onChange={formData.handleChange}
            error={formData.touched.year ? formData.errors.year : ''}
            options={DateOptions.getYearsInRange(DateOptions.year_range)}
          />
        </div>
        <div className="w-1/4">
          <SelectInput
            id="day"
            name="day"
            value={formData.values.day}
            label="Day"
            onFocus={formData.handleFocus}
            onBlur={formData.handleBlur}
            onChange={formData.handleChange}
            error={formData.touched.day ? formData.errors.day : ''}
            options={DateOptions.daysInMonth(
              formData.values.month,
              formData.values.year
            )}
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <Button type="submit" isLoading={isLoading}>
          Continue
        </Button>
      </div>
    </form>
  );
};

Form1.propTypes = {
  formData: PropTypes.shape({
    handleFocus: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    values: PropTypes.shape({
      month: PropTypes.string.isRequired,
      day: PropTypes.string.isRequired,
      year: PropTypes.string.isRequired,
    }),
    touched: PropTypes.shape({
      month: PropTypes.bool.isRequired,
      day: PropTypes.bool.isRequired,
      year: PropTypes.bool.isRequired,
    }),
    errors: PropTypes.shape({
      month: PropTypes.string,
      day: PropTypes.string,
      year: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool,
};

Form1.defaultProps = {
  isLoading: false,
};

export default Form1;

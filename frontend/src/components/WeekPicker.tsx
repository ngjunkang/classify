import DateFnsUtils from "@date-io/date-fns";
import { IconButton, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import clsx from "clsx";
import {
  endOfWeek,
  format,
  isSameDay,
  isValid,
  isWithinInterval,
  startOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale";
import React, { useState } from "react";

interface WeekPickerProps {
  handleOnChange: (date: Date) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dayWrapper: {
      position: "relative",
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: "0 2px",
      color: "inherit",
    },
    customDayHighlight: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: "2px",
      right: "2px",
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: "50%",
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
      color: "#676767",
    },
    highlight: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    firstHighlight: {
      extend: "highlight",
      borderTopLeftRadius: "50%",
      borderBottomLeftRadius: "50%",
    },
    endHighlight: {
      extend: "highlight",
      borderTopRightRadius: "50%",
      borderBottomRightRadius: "50%",
    },
  })
);

const makeJSDateObject = (date: Date) => {
  return new Date(date.getTime());
};

const WeekPicker: React.FC<WeekPickerProps> = ({ handleOnChange }) => {
  const classes = useStyles();
  const [state, setState] = useState(new Date());

  const handleWeekChange = (date: Date) => {
    const tempDate: Date = startOfWeek(makeJSDateObject(date));
    setState(tempDate);
    handleOnChange(tempDate);
  };

  const formatWeekSelectLabel = (date: Date, invalidLabel: string): string => {
    let dateClone = makeJSDateObject(date);

    return dateClone && isValid(dateClone)
      ? `Week of ${format(startOfWeek(dateClone), "MMM do")}`
      : invalidLabel;
  };

  const renderWrappedWeekDay = (
    date: Date,
    selectedDate: Date,
    dayInCurrentMonth: boolean
  ): JSX.Element => {
    let dateClone = makeJSDateObject(date);
    let selectedDateClone = makeJSDateObject(selectedDate);

    const start = startOfWeek(selectedDateClone);
    const end = endOfWeek(selectedDateClone);

    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const isFirstDay = isSameDay(dateClone, start);
    const isLastDay = isSameDay(dateClone, end);

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, "d")} </span>
        </IconButton>
      </div>
    );
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enUS}>
      <DatePicker
        label="Pick a week"
        value={state}
        onChange={handleWeekChange}
        renderDay={renderWrappedWeekDay}
        labelFunc={formatWeekSelectLabel}
      />
    </MuiPickersUtilsProvider>
  );
};

export default WeekPicker;

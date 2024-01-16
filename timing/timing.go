package timing

import (
	"log"
	"time"
)

type Range struct {
	From int64
	To   int64
}

func IsWithinSameDay(now time.Time, then time.Time) bool {
	today := now.Day()
	todayMonth := now.Month()
	todayYear := now.Year()
	thenDay := then.Day()
	thenMonth := then.Month()
	thenYear := then.Year()

	if today != thenDay || todayMonth != thenMonth || todayYear != thenYear {
		return false
	}

	return true
}

func IsToday(ts int64) bool {
	timeTo := time.Unix(0, ts)
	timeNow := time.Now()
	timeDiffToNow := timeTo.Sub(timeNow)
	numberOfDaysToNow := int(timeDiffToNow.Hours() / 24)
	return numberOfDaysToNow == 0 && timeNow.Day() == timeTo.Day()
}

func DurationUntilNow(ts int64) time.Duration {
	timeNow := time.Now()
	timeFrom := time.Unix(0, ts)
	return timeFrom.Sub(timeNow)
}

func NumberOfDaysInRange(from, to int64) int {
	timeFrom := time.Unix(0, from)
	timeTo := time.Unix(0, to)
	timeDiffFromTo := timeTo.Sub(timeFrom)
	return int(timeDiffFromTo.Hours() / 24)
}

func StartOfDay(tm time.Time) time.Time {
	return time.Date(tm.Year(), tm.Month(), tm.Day(), 0, 0, 0, 0, time.Local)
}

func EndOfDay(tm time.Time) time.Time {
	return time.Date(tm.Year(), tm.Month(), tm.Day(), 23, 59, 59, 0, time.Local)
}

func DaysInRange(from, to int64) []Range {
	timeFrom := time.Unix(0, from)
	timeTo := time.Unix(0, to)

	queries := []Range{}
	nextTime := timeFrom
	for {
		if nextTime.UnixNano() >= timeTo.UnixNano() {
			break
		}
		queries = append(queries, DayRange(nextTime))
		nextTime = nextTime.Add(time.Hour * 24)
	}

	return queries
}

func DayRange(ts time.Time) Range {
	startOfDay := StartOfDay(ts)
	endOfDay := EndOfDay(ts)
	return Range{
		From: startOfDay.UnixNano(),
		To:   endOfDay.UnixNano(),
	}
}

func DaysInRangeNotToday(from, to int64) []Range {
	timeFrom := time.Unix(0, from)
	timeTo := time.Unix(0, to)
	if IsToday(to) {
		timeTo = timeTo.Add(time.Hour * 24 * -1)
		if IsToday(from) {
			return []Range{}
		}
	}

	queries := []Range{}
	nextTime := timeFrom.Add(time.Hour * 24)
	for {
		// break before in case on an only today time range (empty result)
		queries = append(queries, DayRange(nextTime))
		if nextTime.UnixNano() >= timeTo.UnixNano() {
			break
		}

		nextTime = nextTime.Add(time.Hour * 24)
	}

	return queries
}

func TimezoneOffset() int {
	t := time.Now()
	zone, offset := t.Zone()
	log.Println(zone, offset)
	return offset
}

// https://stackoverflow.com/a/55093788
func InTimeRange(start, end, check time.Time) bool {
	if start.Before(end) {
		return !check.Before(start) && !check.After(end)
	}
	if start.Equal(end) {
		return check.Equal(start)
	}
	return !start.After(check) || !end.Before(check)
}

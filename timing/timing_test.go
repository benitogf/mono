package timing_test

import (
	"testing"
	"time"

	"github.com/benitogf/mono/timing"
	"github.com/stretchr/testify/require"
)

func TestDayQueries(t *testing.T) {
	// http://10.0.1.197:3036/report/baccarat/players/1667232000000000000/1669219199000000000
	from := int64(1667232000000000000)
	to := int64(1669219199000000000)
	queries := timing.DaysInRange(from, to)
	require.Equal(t, 23, len(queries))
	require.Equal(t, from, queries[0].From)
	require.Equal(t, to, queries[len(queries)-1].To)

	// http://10.0.1.197:3036/report/baccarat/players/1669132800000000000/1669219199000000000
	from = int64(1669132800000000000)
	to = int64(1669219199000000000)
	queries = timing.DaysInRange(from, to)
	require.Equal(t, 1, len(queries))
	require.Equal(t, from, queries[0].From)
	require.Equal(t, to, queries[0].To)

	timeNow := time.Now()

	// from seven days ago
	timeFrom := timeNow.Add(time.Hour * 24 * 7 * -1)
	queries = timing.DaysInRange(timeFrom.UnixNano(), timeNow.UnixNano())
	require.Equal(t, 7, len(queries))
	queries = timing.DaysInRangeNotToday(timeFrom.UnixNano(), timeNow.UnixNano())
	require.Equal(t, 6, len(queries))

	// one day
	start := timing.StartOfDay(timeNow)
	end := timing.EndOfDay(timeNow)
	queries = timing.DaysInRangeNotToday(start.UnixNano(), end.UnixNano())
	require.Equal(t, 0, len(queries))
	queries = timing.DaysInRange(start.UnixNano(), end.UnixNano())
	require.Equal(t, 1, len(queries))
}

func TestTimezone(t *testing.T) {
	offset := timing.TimezoneOffset()
	require.Equal(t, 28800, offset)
}

import { useState, useRef, useEffect, useId } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";

const inputCls =
  "w-full rounded border border-border bg-surface px-4 py-2 text-sm text-heading outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary-light placeholder:text-muted";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      currentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
  }
  const remaining = 7 - (days.length % 7 || 7);
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
  }

  return days;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DatePicker({
  value,
  onChange,
  id: externalId,
  disabled = false,
  className = "",
}) {
  const generatedId = useId();
  const id = externalId || generatedId;
  const containerRef = useRef(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const calendarDays = buildCalendarDays(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    onChange({ target: { value: `${y}-${m}-${d}` } });
    setIsOpen(false);
  };

  const clearDate = (e) => {
    e.stopPropagation();
    onChange({ target: { value: "" } });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          id={id}
          type="text"
          readOnly
          value={displayValue}
          placeholder="Select a date"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`${inputCls}${disabled ? " opacity-50 cursor-not-allowed" : " cursor-pointer"}`}
          disabled={disabled}
        />
        {selectedDate && !disabled && (
          <button
            type="button"
            onClick={clearDate}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-text transition"
          >
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </button>
        )}
      </div>
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 z-50 mt-1 w-72 rounded border border-border bg-surface shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="flex items-center justify-center w-7 h-7 text-text hover:text-primary hover:bg-primary-light rounded transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="xs" />
            </button>
            <span className="text-sm font-semibold text-heading">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="flex items-center justify-center w-7 h-7 text-text hover:text-primary hover:bg-primary-light rounded transition"
            >
              <FontAwesomeIcon icon={faChevronRight} size="xs" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((d, i) => {
              const isSelected = selectedDate && isSameDay(d.date, selectedDate);
              const isToday = isSameDay(d.date, today);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDate(d.date)}
                  className={[
                    "text-center text-sm py-1.5 rounded transition",
                    !d.currentMonth ? "text-muted/30" : "text-text hover:bg-primary-light",
                    isSelected ? "bg-primary text-white hover:bg-primary-hover" : "",
                    isToday && !isSelected ? "ring-1 ring-inset ring-primary" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

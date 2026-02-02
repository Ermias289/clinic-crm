// src/components/appointments/TimeSlotSelector.tsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfWeek, isToday, isSameDay, parseISO, addDays, subDays } from 'date-fns';
import { appointmentService } from "@/lib/api/appointments";

interface TimeSlotSelectorProps {
  doctorId: string;
  branchId: string;
  date: string;
  onTimeSelect: (time: string) => void;
  selectedTime?: string;
}

interface DaySlots {
  date: Date;
  slots: string[];
  isLoading: boolean;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  doctorId,
  branchId,
  date,
  onTimeSelect,
  selectedTime
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(date ? parseISO(date) : new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [daySlots, setDaySlots] = useState<Map<string, DaySlots>>(new Map());

  // Generate week days (Sunday to Saturday)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  // Fetch free slots for a specific day
  const fetchSlotsForDay = async (day: Date) => {
    if (!doctorId || !branchId) return;
    
    const dateKey = format(day, 'yyyy-MM-dd');
    
    // Don't refetch if already loading or loaded
    if (daySlots.get(dateKey)?.isLoading) return;
    
    // Mark as loading
    setDaySlots(prev => new Map(prev.set(dateKey, {
      date: day,
      slots: [],
      isLoading: true
    })));
    
    try {
      const slots = await appointmentService.getFreeSlots(
        parseInt(doctorId),
        dateKey,
        parseInt(branchId)
      );
      
      // Update with fetched slots
      setDaySlots(prev => new Map(prev.set(dateKey, {
        date: day,
        slots,
        isLoading: false
      })));
    } catch (error) {
      console.error('Error fetching free slots:', error);
      setDaySlots(prev => new Map(prev.set(dateKey, {
        date: day,
        slots: [],
        isLoading: false
      })));
    }
  };

  // Fetch slots when selected date changes
  useEffect(() => {
    fetchSlotsForDay(selectedDate);
  }, [selectedDate, doctorId, branchId]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(weekStart);
    if (direction === 'prev') {
      newWeekStart.setDate(newWeekStart.getDate() - 7);
    } else {
      newWeekStart.setDate(newWeekStart.getDate() + 7);
    }
    setWeekStart(newWeekStart);
  };

  const formatTimeDisplay = (timeString: string) => {
    // Convert HH:MM to AM/PM format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get slots for a specific day
  const getSlotsForDay = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return daySlots.get(dateKey);
  };

  // Group slots by morning/afternoon
  const groupSlotsByTimeOfDay = (slots: string[]) => {
    const morningSlots: string[] = [];
    const afternoonSlots: string[] = [];
    const eveningSlots: string[] = [];

    slots.forEach(slot => {
      const hour = parseInt(slot.split(':')[0]);
      if (hour < 12) {
        morningSlots.push(slot);
      } else if (hour < 17) {
        afternoonSlots.push(slot);
      } else {
        eveningSlots.push(slot);
      }
    });

    return { morningSlots, afternoonSlots, eveningSlots };
  };

  const selectedDayData = getSlotsForDay(selectedDate);
  const { morningSlots = [], afternoonSlots = [], eveningSlots = [] } = 
    selectedDayData ? groupSlotsByTimeOfDay(selectedDayData.slots) : {};

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateWeek('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          Week of {format(weekStart, 'MMM d')}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateWeek('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayData = getSlotsForDay(day);
          const hasSlots = dayData && dayData.slots.length > 0;
          const slotCount = dayData?.slots.length || 0;
          const isLoading = dayData?.isLoading || false;
          
          return (
            <Button
              key={index}
              variant={isSameDay(day, selectedDate) ? "default" : "outline"}
              className={`flex-col h-auto py-3 relative ${
                isToday(day) ? 'border-blue-500 border-2' : ''
              } ${hasSlots ? 'border-green-200' : ''}`}
              onClick={() => setSelectedDate(day)}
              disabled={isLoading}
            >
              <div className="text-xs font-medium">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-semibold ${isSameDay(day, selectedDate) ? 'text-white' : ''}`}>
                {format(day, 'd')}
              </div>

              
              {isLoading && (
                <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-dental"></div>
                </div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Selected Date Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Selected Date</p>
                <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>
            {selectedDayData && !selectedDayData.isLoading && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {selectedDayData.slots.length} available slots
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State for Selected Day */}
      {selectedDayData?.isLoading && (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dental mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading available slots...</p>
        </div>
      )}

      {/* Free Slots Display for Selected Day */}
      {selectedDayData && !selectedDayData.isLoading && (
        <div className="space-y-6">
          {/* Morning Slots */}
          {morningSlots.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Morning Slots ({morningSlots.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedTime === slot ? "default" : "outline"}
                    className="h-12"
                    onClick={() => onTimeSelect(slot)}
                  >
                    <div className="text-sm">
                      {formatTimeDisplay(slot)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Afternoon Slots */}
          {afternoonSlots.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Afternoon Slots ({afternoonSlots.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedTime === slot ? "default" : "outline"}
                    className="h-12"
                    onClick={() => onTimeSelect(slot)}
                  >
                    <div className="text-sm">
                      {formatTimeDisplay(slot)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Evening Slots */}
          {eveningSlots.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Evening Slots ({eveningSlots.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {eveningSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedTime === slot ? "default" : "outline"}
                    className="h-12"
                    onClick={() => onTimeSelect(slot)}
                  >
                    <div className="text-sm">
                      {formatTimeDisplay(slot)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedDayData.slots.length === 0 && (
            <div className="py-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No available slots</h3>
              <p className="text-muted-foreground mt-2">
                No available time slots for {format(selectedDate, 'MMMM d')}.
                Try selecting another day.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Time Display */}
      {selectedTime && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected Time</p>
                <p className="font-medium text-green-800">{formatTimeDisplay(selectedTime)}</p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                ✓ Selected
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeSlotSelector;
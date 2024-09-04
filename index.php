<!DOCTYPE html>
<html lang="en">

<head>
    <title>Simple Calendar with Vanilla JavaScript</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" href="index.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>

<body>
    <div class="wrapper d-flex justify-content-around align-items-start w-100">
        <div class="table-container w-50">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Start</th>
                        <th scope="col">End</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                </tbody>
            </table>
        </div>


        <div class="cardlendar">
            <div class="calendar-toolbar">
                <button class="prev month-btn">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <div class="current-month"></div>
                <button class="next month-btn">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
            <div class="calendar">
                <div class="weekdays">
                    <div class="weekday-name">Su</div>
                    <div class="weekday-name">Mo</div>
                    <div class="weekday-name">Tu</div>
                    <div class="weekday-name">We</div>
                    <div class="weekday-name">Th</div>
                    <div class="weekday-name">Fr</div>
                    <div class="weekday-name">Sa</div>
                </div>
                <div class="calendar-days"></div>
            </div>
            <div class="goto-buttons">
                <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#addMeetModal">New
                    Meeting</button>
                <button type="button" class="btn today">Today</button>
            </div>
        </div>
    </div>

    <div class="modal fade modal-xl" id="addMeetModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header custom-bg">
                    <h4 id="event-modal-header-title" class="modal-title text-white">New Event</h4>
                </div>
                <div class="modal-body d-flex justify-content-between gap-5 align-items-center">
                    <form id="addMeet" class="d-flex flex-column gap-3 w-75">
                        <input type="hidden" id="meetingId" name="meeting_id">
                        <div class="d-flex justify-content-between align-items-center">
                            <label class="w-25" for="meetingName">Meeting name</label>
                            <input type="text" class="form-control w-75" id="meetingName" name="meeting_name" required>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <label class="w-25" for="startTime">Start time</label>
                            <input type="datetime-local" class="form-control w-75" id="startTime" name="start_time"
                                required>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <label class="w-25" for="endTime">End time</label>
                            <input type="datetime-local" class="form-control w-75" id="endTime" name="end_time"
                                required>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <label class="w-25">Color</label>
                            <div class="w-75 d-flex gap-2">
                                <label>
                                    <input type="radio" name="color" value="105AB4">
                                    <span class="color-preview" style="background-color: #105AB4;"></span>
                                </label>
                                <label>
                                    <input type="radio" name="color" value="2c514c">
                                    <span class="color-preview" style="background-color: #2c514c;"></span>
                                </label>
                                <label>
                                    <input type="radio" name="color" value="a42cd6">
                                    <span class="color-preview" style="background-color: #a42cd6;"></span>
                                </label>
                                <label>
                                    <input type="radio" name="color" value="890620">
                                    <span class="color-preview" style="background-color: #890620;"></span>
                                </label>
                            </div>
                        </div>

                        <!-- pesan eror -->
                        <div class="w-100 text-end">
                            <small class="text-danger"></small>
                        </div>

                        <div class="d-flex gap-3 justify-content-end">
                            <button type="button" class="btn btn-secondary rounded-5 px-4"
                                data-bs-dismiss="modal">Batal</button>
                            <button type="submit" class="btn btn-custom rounded-5 px-4" id="saveEvent">Save</button>
                        </div>
                    </form>

                    <div class="cardlendar">
                        <div class="calendar-toolbar">
                            <button class="prev month-btn">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                            <div class="current-month"></div>
                            <button class="next month-btn">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                        <div class="calendar">
                            <div class="weekdays">
                                <div class="weekday-name">Su</div>
                                <div class="weekday-name">Mo</div>
                                <div class="weekday-name">Tu</div>
                                <div class="weekday-name">We</div>
                                <div class="weekday-name">Th</div>
                                <div class="weekday-name">Fr</div>
                                <div class="weekday-name">Sa</div>
                            </div>
                            <div class="calendar-days"></div>
                        </div>
                        <div class="goto-buttons">
                            <button type="button" class="btn today">Today</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
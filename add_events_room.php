<?php
include 'db.php';

$meeting_name = $_POST['meeting_name'];
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];
$color = $_POST['color'];

// Check for conflicting schedules
$check_sql = "SELECT * FROM room_schedule WHERE (start_time < '$end_time' AND end_time > '$start_time')";
$check_result = $conn->query( $check_sql );

if ( $check_result->num_rows > 0 ) {
    echo json_encode( array( "status" => "error", "message" => "Room not available" ) );
} else {
    // Add event if no conflict
    $sql = "INSERT INTO room_schedule (meeting_name, start_time, end_time, color) VALUES ('$meeting_name', '$start_time', '$end_time', '$color')";
    if ( $conn->query( $sql ) ) {
        echo json_encode( array( "status" => "success", "message" => "Event added successfully" ) );
    } else {
        echo json_encode( array( "status" => "error", "message" => "Error: " . $conn->error ) );
    }
}

$conn->close();
?>
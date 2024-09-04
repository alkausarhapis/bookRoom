<?php
include 'db.php';

if ( $conn->connect_error ) {
    die( json_encode( array( "error" => "Database connection failed: " . $conn->connect_error ) ) );
}

$sql = "SELECT id_activity, meeting_name, color,
        DATE_FORMAT(start_time, '%Y-%m-%dT%H:%i:%s') AS formatted_start_time,
        DATE_FORMAT(end_time, '%Y-%m-%dT%H:%i:%s') AS formatted_end_time
        FROM room_schedule
        ORDER BY formatted_start_time";
$result = $conn->query( $sql );

$events = array();

if ( $result ) {
    if ( $result->num_rows > 0 ) {
        while ( $row = $result->fetch_assoc() ) {
            $events[] = $row;
        }
    }
} else {
    die( json_encode( array( "error" => "Error executing query: " . $conn->error ) ) );
}

header( 'Content-Type: application/json' );
echo json_encode( $events );

$conn->close();
?>
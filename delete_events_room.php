<?php
include 'db.php';

if ( isset( $_POST['id_activity'] ) ) {
    $id_activity = $_POST['id_activity'];

    $sql = "DELETE FROM room_schedule WHERE id_activity='$id_activity'";
    if ( $conn->query( $sql ) === TRUE ) {
        echo "Event deleted successfully";
    } else {
        echo "Error: " . $conn->error;
    }
}
$conn->close();
?>
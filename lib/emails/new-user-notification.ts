import type { ClerkUserCreatedEvent } from "../../types/clerk-user-created-event-type";

const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #007bff;
            color: white;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>New User Registration</h2>
        <table>
            <tr>
                <th>Field</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Created At</td>
                <td>{{created_at}}</td>
            </tr>
            <tr>
                <td>Email Address</td>
                <td>{{email_address}}</td>
            </tr>
            <tr>
                <td>First Name</td>
                <td>{{first_name}}</td>
            </tr>
            <tr>
                <td>Last Name</td>
                <td>{{last_name}}</td>
            </tr>
            <tr>
                <td>Gender</td>
                <td>{{gender}}</td>
            </tr>
            <tr>
                <td>Username</td>
                <td>{{username}}</td>
            </tr>
        </table>
        <div class="footer">
            <p>&copy; 2025 Cibuson. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

export const newUserNotificationTemplate = (data: ClerkUserCreatedEvent) => {
    return emailTemplate
      .replace("{{created_at}}", new Date(data.data.created_at).toLocaleString())
      .replace("{{email_address}}", data.data.email_addresses[0].email_address)
      .replace("{{first_name}}", data.data.first_name)
      .replace("{{last_name}}", data.data.last_name)
      .replace("{{gender}}", data.data.gender || "Not Provided")
      .replace("{{username}}", data.data.username || "Not Provided");
  }
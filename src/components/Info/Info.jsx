import React from 'react';

export default function Leds() {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            Height
          </td>
          <td>
            {window.screen.height}
          </td>
        </tr>
        <tr>
          <td>
            Width
          </td>
          <td>
            {window.screen.width}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

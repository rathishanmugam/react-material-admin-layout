import React from 'react'

export default ({ name, message,tot }) =>
  <p>
    <strong>{name}</strong> <em>{message}</em><strong>    {tot} New Messages</strong>
  </p>

import React from 'react'

const ActivateDeactivateButton = () => {
  return (
    <button className="px-3 py-1 rounded bg-[var(--btn-primary-bg)] dark:bg-[var(--btn-primary-bg)] 
      text-[var(--btn-primary-text)] dark:text-[var(--btn-primary-text)]
      hover-[var(--btn-primary-hover)] dark:hover-[var(--btn-primary-hover)]">Deactivate</button>
  )
}

export default ActivateDeactivateButton
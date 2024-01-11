const ContextMenu = ({
  customer,
  history,
  onEdit,
  onDelete,
  xPos,
  yPos,
  showMenu,
}) => {
  if (!showMenu) return null;

  const handleEditClick = () => {
    if (customer) {
      onEdit(customer);
    } else if (history) {
      onEdit(history);
    }
  };

  const handleDeleteClick = () => {
    if (customer) {
      onDelete(customer);
    } else if (history) {
      onDelete(history);
    }
  };

  return (
    <div className="context-menu" style={{ top: yPos, left: xPos }}>
      <div className="context-menu-item" onClick={handleEditClick}>
        수정
      </div>
      <div className="context-menu-item" onClick={handleDeleteClick}>
        삭제
      </div>
    </div>
  );
};

export default ContextMenu;

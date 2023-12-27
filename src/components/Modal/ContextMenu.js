const ContextMenu = ({ customer, onEdit, onDelete, xPos, yPos, showMenu }) => {
  if (!showMenu) return null;

  return (
    <div className="context-menu" style={{ top: yPos, left: xPos }}>
      <div className="context-menu-item" onClick={() => onEdit(customer)}>
        수정
      </div>
      <div className="context-menu-item" onClick={() => onDelete(customer)}>
        삭제
      </div>
    </div>
  );
};

export default ContextMenu;

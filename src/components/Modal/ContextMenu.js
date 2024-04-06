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
    <div
      className="context-menu h-[38px] w-[40px] text-[10px] lg:w-[108px] lg:text-sm "
      style={{ top: yPos, left: xPos }}
    >
      <div
        className="context-menu-item justify-center py-[9px] lg:justify-start lg:px-5
       "
        onClick={handleEditClick}
      >
        수정
      </div>
      <div
        className="context-menu-item justify-center py-[9px] lg:justify-start lg:px-5"
        onClick={handleDeleteClick}
      >
        삭제
      </div>
    </div>
  );
};

export default ContextMenu;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.delete__user').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const target = event.currentTarget;
      const userId = target.getAttribute('data-id');
      if (!userId) return;

      if (!confirm('Вы уверены, что хотите удалить пользователя?')) return;

      try {
        const response = await fetch(`/admin/user/${userId}/delete`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Ошибка при удалении пользователя');
        }

        const listItem = target.closest('li');
        if (listItem) listItem.remove();
      } catch (error) {
        alert(`Ошибка: ${error.message}`);
      }
    });
  });
});

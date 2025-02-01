import { apiRequest } from '../config';

const handleRequest = async (requestId, action) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
      setToast({
        show: true,
        message: "Admin access required",
        type: "error"
      });
      return;
    }

    const data = await apiRequest('/admin/handle-request', {
      method: 'POST',
      body: JSON.stringify({
        requestId,
        action,
        userId: user._id,
        message: `Your book request has been ${action}`
      })
    });

    setToast({
      show: true,
      message: data.message,
      type: "success"
    });

    // Refresh requests list
    fetchRequests();

  } catch (error) {
    console.error('Error handling request:', error);
    setToast({
      show: true,
      message: error.message,
      type: "error"
    });
  }
}; 

async function testSupport() {
    try {
        const res = await fetch('http://localhost:3000/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userPhone: '79111111111', text: 'Test complaint' })
        });
        console.log("Status:", res.status);
        console.log("Body:", await res.json());
    } catch (e) {
        console.error("Error:", e);
    }
}
testSupport();

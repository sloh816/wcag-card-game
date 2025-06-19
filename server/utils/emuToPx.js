function emuToPx(emuValue, scale) {
	const EMU_PER_PIXEL = scale || 9525;
	return Math.round(emuValue / EMU_PER_PIXEL);
}

module.exports = emuToPx;

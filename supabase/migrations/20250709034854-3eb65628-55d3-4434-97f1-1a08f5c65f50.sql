-- Actualizar algunos productos para que tengan featured=true y oferta=true para testing
UPDATE productos 
SET featured = true 
WHERE id IN (621, 623, 625, 627, 629, 631, 635, 669, 671, 1300);

UPDATE productos 
SET oferta = true 
WHERE id IN (625, 629, 635, 671);
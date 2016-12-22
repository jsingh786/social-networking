<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class certification
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $autority;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $license_number;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $is_expired;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $certification_date;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersCertification")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $certificationsUser;
}